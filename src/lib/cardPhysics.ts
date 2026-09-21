/**
 * Rigid-body settle + drag/throw for the fidget cards.
 *
 * The design file drove this with Matter.js from a CDN. The repo keeps the
 * same behaviour without the dependency, because the cards only need what
 * is here: gravity, four static walls, restitution, and a pointer grab
 * that lets you pick a card up and fling it.
 *
 * Bodies are axis-aligned boxes. Rotation is carried as a scalar and driven
 * by the torque a throw imparts, which reads the same as Matter's result at
 * this scale without needing a full collision solver.
 */

export type CardBody = {
  el: HTMLElement
  /** Half-extents, in stage px. */
  w: number
  h: number
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  va: number
  /** Resting on the floor as of the last step — treated as immovable. */
  grounded: boolean
}

export type PhysicsOptions = {
  /** Downward acceleration, in stage px per step². Design default: 0.4. */
  gravity?: number
  /** Bounce retained on impact. */
  restitution?: number
  /** Per-step velocity retention while airborne. */
  frictionAir?: number
  /** Velocity retention when sliding along the floor. */
  friction?: number
  /** The board is CSS-scaled, so pointer deltas need the inverse scale. */
  getScale?: () => number
}

const FIXED_STEP = 1000 / 60
const MAX_STEPS = 5
/** Window of pointer history a throw's velocity is measured over. */
const FLING_WINDOW_MS = 70
/** Ceiling on throw speed, in stage px per step. */
const MAX_FLING = 55
/**
 * Below this a contact is treated as resting rather than bouncing. It has
 * to sit above one step of gravity (a body landing from rest carries
 * `gravity * (1 - frictionAir)`), or the floor contact never damps out and
 * the card bounces forever. Raise `gravity` and this needs raising too.
 */
const REST_SPEED = 0.6

type Sample = { x: number; y: number; t: number }

export class CardPhysics {
  private stage: HTMLElement
  private bodies: CardBody[]
  private opts: Required<Omit<PhysicsOptions, 'getScale'>> & {
    getScale: () => number
  }

  private raf = 0
  private last = 0
  private acc = 0
  private running = false

  /** The card currently held, plus where within it the grab landed. */
  private held: { body: CardBody; dx: number; dy: number; pointerId: number } | null = null
  private pointer = { x: 0, y: 0 }
  private history: Sample[] = []

  constructor(stage: HTMLElement, elements: HTMLElement[], options: PhysicsOptions = {}) {
    this.stage = stage
    this.opts = {
      gravity: options.gravity ?? 0.4,
      restitution: options.restitution ?? 0.45,
      frictionAir: options.frictionAir ?? 0.02,
      friction: options.friction ?? 0.3,
      getScale: options.getScale ?? (() => 1),
    }

    // Freeze each card where the CSS drop-in left it, then hand it to the
    // simulation. offsetLeft/Top are still the design coordinates at this
    // point because the drop animation only translates.
    this.bodies = elements.map((el) => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      el.style.animation = 'none'
      return {
        el,
        w: w / 2,
        h: h / 2,
        x: el.offsetLeft + w / 2,
        y: el.offsetTop + h / 2,
        vx: 0,
        vy: 0,
        angle: 0,
        va: 0,
        grounded: false,
      }
    })

    this.attach()
    this.running = true
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.frame)
  }

  // ── Input ────────────────────────────────────────────────────────

  /*
   * Move/up listen on `window` rather than using setPointerCapture on the
   * stage. Capture would retarget boundary events and leave the cards'
   * React hover state latched mid-drag, and if a release were ever missed
   * outside the stage the grab would wedge permanently. `blur` is a last
   * resort for the case where the window loses focus mid-gesture.
   */
  private attach() {
    this.stage.addEventListener('pointerdown', this.onDown)
    window.addEventListener('pointermove', this.onMove)
    window.addEventListener('pointerup', this.onUp)
    // A cancel is not a throw, and browsers disagree about whether it even
    // carries useful coordinates — so drop the card rather than fling it.
    window.addEventListener('pointercancel', this.release)
    window.addEventListener('blur', this.release)
  }

  private detach() {
    this.stage.removeEventListener('pointerdown', this.onDown)
    window.removeEventListener('pointermove', this.onMove)
    window.removeEventListener('pointerup', this.onUp)
    window.removeEventListener('pointercancel', this.release)
    window.removeEventListener('blur', this.release)
  }

  /** Stage-local pointer position, corrected for the board's CSS scale. */
  private toStage(e: { clientX: number; clientY: number }) {
    const r = this.stage.getBoundingClientRect()
    const s = this.opts.getScale() || 1
    return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s }
  }

  /**
   * Which card is on top at this point. Paint order comes from the cards'
   * z-index, which React owns, so the hit test reads it back off the DOM
   * rather than keeping a parallel order the sim could get wrong.
   */
  private topmostAt(p: { x: number; y: number }): CardBody | null {
    let best: CardBody | null = null
    let bestZ = -Infinity
    for (let i = 0; i < this.bodies.length; i++) {
      const b = this.bodies[i]
      if (Math.abs(p.x - b.x) > b.w || Math.abs(p.y - b.y) > b.h) continue
      const raw = getComputedStyle(b.el).zIndex
      // Ties fall back to DOM order, matching how the browser paints them.
      const z = (raw === 'auto' ? 0 : Number(raw) || 0) * 1000 + i
      if (z > bestZ) {
        bestZ = z
        best = b
      }
    }
    return best
  }

  private onDown = (e: PointerEvent) => {
    if (!e.isPrimary || e.button !== 0 || this.held) return
    const p = this.toStage(e)
    const body = this.topmostAt(p)
    if (!body) return

    // Deliberately no preventDefault: it would suppress focus, so the card
    // could never be focused by clicking. The screenshot carries
    // draggable={false} and the card `select-none`, which is what actually
    // stops a native image drag from cancelling the gesture.
    this.held = { body, dx: p.x - body.x, dy: p.y - body.y, pointerId: e.pointerId }
    this.pointer = p
    this.history = [{ ...p, t: e.timeStamp }]
    body.va = 0
    body.vx = 0
    body.vy = 0
  }

  private onMove = (e: PointerEvent) => {
    if (!this.held || e.pointerId !== this.held.pointerId) return
    e.preventDefault()
    this.pointer = this.toStage(e)
    this.history.push({ ...this.pointer, t: e.timeStamp })
    // Keep a little more than the fling window so the trim is cheap.
    const cutoff = e.timeStamp - FLING_WINDOW_MS * 2
    while (this.history.length > 2 && this.history[0].t < cutoff) this.history.shift()
  }

  private onUp = (e: PointerEvent) => {
    if (!this.held || e.pointerId !== this.held.pointerId) return
    // A mouse keeps one pointerId across buttons, so releasing a secondary
    // button mid-drag must not count as letting go. (-1 covers pens/touch.)
    if (e.button !== 0 && e.button !== -1) return
    const body = this.held.body

    // The release point is part of the gesture; without it the motion
    // between the last move and the release is thrown away.
    const to = { ...this.toStage(e), t: e.timeStamp }
    this.history.push(to)

    /*
     * Measure the throw over the tail of the gesture and convert px/ms into
     * the px-per-step the integrator works in. Reading it here rather than
     * from the last simulation step keeps it independent of frame pacing.
     * If nothing moved inside the window the card is being set down, not
     * thrown, so it leaves with no velocity.
     */
    const recent = this.history.filter((s) => to.t - s.t <= FLING_WINDOW_MS)
    const from = recent.length >= 2 ? recent[0] : null
    const dt = from ? to.t - from.t : 0
    if (from && dt > 8) {
      const k = FIXED_STEP / dt
      body.vx = clamp((to.x - from.x) * k, -MAX_FLING, MAX_FLING)
      body.vy = clamp((to.y - from.y) * k, -MAX_FLING, MAX_FLING)
      body.va = clamp((to.x - from.x) * k * 0.0016, -0.08, 0.08)
    } else {
      body.vx = 0
      body.vy = 0
      body.va = 0
    }

    this.held = null
    this.history = []
  }

  /** Drops the card where it is, with no throw. */
  private release = () => {
    if (!this.held) return
    const body = this.held.body
    body.vx = 0
    body.vy = 0
    body.va = 0
    this.held = null
    this.history = []
  }

  // ── Simulation ───────────────────────────────────────────────────

  private frame = (now: number) => {
    if (!this.running) return
    // Clamp so a backgrounded tab doesn't resume with one enormous step.
    this.acc = Math.min(this.acc + (now - this.last), FIXED_STEP * MAX_STEPS)
    this.last = now
    while (this.acc >= FIXED_STEP) {
      this.step()
      this.acc -= FIXED_STEP
    }
    this.draw()
    this.raf = requestAnimationFrame(this.frame)
  }

  private step() {
    const W = this.stage.offsetWidth
    const H = this.stage.offsetHeight
    const { gravity, frictionAir, friction } = this.opts

    if (this.held) {
      const { body, dx, dy } = this.held
      const px = body.x
      const py = body.y
      body.x = this.pointer.x - dx
      body.y = this.pointer.y - dy
      // A held card is still confined to the stage, otherwise dragging one
      // out of bounds would grow the page and feed back into the board
      // scale mid-gesture.
      this.clamp(body, W, H, false)
      // Carry the hand's speed so shoving one card into another transfers
      // momentum instead of just teleporting it aside. Clamped because a
      // pointer can jump (re-entering the viewport, a pen sample gap), and
      // an unbounded step here would launch the other card.
      body.vx = clamp(body.x - px, -MAX_FLING, MAX_FLING)
      body.vy = clamp(body.y - py, -MAX_FLING, MAX_FLING)
      body.grounded = false
    }

    for (const b of this.bodies) {
      if (this.held && this.held.body === b) continue

      b.vy += gravity
      b.vx *= 1 - frictionAir
      b.vy *= 1 - frictionAir
      b.x += b.vx
      b.y += b.vy
      b.angle += b.va
      b.va *= 0.96

      b.grounded = this.clamp(b, W, H, true)
      if (b.grounded) {
        b.vx *= 1 - friction
        b.va *= 0.7
        // Settle upright once it has stopped tumbling.
        b.angle *= 0.9
        if (Math.abs(b.angle) < 0.004) b.angle = 0
      }
    }

    this.resolvePairs()
    // Separation can push a body back out of bounds, so the walls get the
    // last word.
    for (const b of this.bodies) this.clamp(b, W, H, false)
  }

  /** Confines a body to the stage. Returns true if it is sitting on the floor. */
  private clamp(b: CardBody, W: number, H: number, bounce: boolean) {
    const { restitution } = this.opts
    let onFloor = false

    if (b.y + b.h > H) {
      b.y = H - b.h
      if (bounce) {
        if (Math.abs(b.vy) > REST_SPEED) b.vy = -b.vy * restitution
        else b.vy = 0
      } else if (b.vy > 0) b.vy = 0
      onFloor = true
    }
    if (b.y - b.h < 0) {
      b.y = b.h
      if (bounce) b.vy = Math.abs(b.vy) * restitution
      else if (b.vy < 0) b.vy = 0
    }
    if (b.x - b.w < 0) {
      b.x = b.w
      if (bounce) {
        b.vx = Math.abs(b.vx) * restitution
        b.va *= 0.8
      } else if (b.vx < 0) b.vx = 0
    }
    if (b.x + b.w > W) {
      b.x = W - b.w
      if (bounce) {
        b.vx = -Math.abs(b.vx) * restitution
        b.va *= 0.8
      } else if (b.vx > 0) b.vx = 0
    }
    return onFloor
  }

  /**
   * Box-box separation so the two cards stack instead of overlapping.
   *
   * A held card and a card resting on the floor are both immovable: the
   * wall clamp would undo their half of the correction on the same step,
   * which leaves the pair permanently overlapped and jittering. Giving the
   * free body the whole correction is what lets a stack come to rest.
   *
   * Only the approaching part of the relative velocity is reversed, so a
   * card settled on another stays settled instead of being kicked.
   */
  private resolvePairs() {
    const { restitution } = this.opts
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const a = this.bodies[i]
        const b = this.bodies[j]
        const ox = a.w + b.w - Math.abs(a.x - b.x)
        const oy = a.h + b.h - Math.abs(a.y - b.y)
        if (ox <= 0 || oy <= 0) continue

        const heldA = this.held?.body === a
        const heldB = this.held?.body === b

        // Separation normal points from a to b along the shallower axis.
        let axis: 'x' | 'y' = oy < ox ? 'y' : 'x'
        // Two floor-bound bodies cannot both be immovable on y or they
        // stay overlapped forever; they separate sideways instead.
        if (axis === 'y' && (heldA || a.grounded) && (heldB || b.grounded)) axis = 'x'

        // The floor pins a grounded body vertically, but it can still slide.
        const fixedA = heldA || (axis === 'y' && a.grounded)
        const fixedB = heldB || (axis === 'y' && b.grounded)
        if (fixedA && fixedB) continue

        const depth = axis === 'y' ? oy : ox
        const sign = (axis === 'y' ? b.y - a.y : b.x - a.x) >= 0 ? 1 : -1

        const shareA = fixedA ? 0 : fixedB ? 1 : 0.5
        const shareB = fixedB ? 0 : fixedA ? 1 : 0.5
        if (axis === 'y') {
          a.y -= sign * depth * shareA
          b.y += sign * depth * shareB
        } else {
          a.x -= sign * depth * shareA
          b.x += sign * depth * shareB
        }

        const rel = axis === 'y' ? b.vy - a.vy : b.vx - a.vx
        const approaching = rel * sign
        if (approaching >= 0) continue // already separating

        const e = Math.abs(approaching) > REST_SPEED ? restitution : 0
        const impulse = -(1 + e) * approaching
        if (axis === 'y') {
          if (!fixedA) a.vy -= impulse * sign * shareA
          if (!fixedB) b.vy += impulse * sign * shareB
        } else {
          if (!fixedA) a.vx -= impulse * sign * shareA
          if (!fixedB) b.vx += impulse * sign * shareB
        }
      }
    }
  }

  private draw() {
    for (const b of this.bodies) {
      b.el.style.left = `${b.x - b.w}px`
      b.el.style.top = `${b.y - b.h}px`
      b.el.style.transform = b.angle ? `rotate(${b.angle}rad)` : ''
    }
  }

  /**
   * Stops the loop and releases the listeners, and deliberately leaves the
   * cards' inline left/top alone: React set those from the same style prop,
   * so clearing them here would unposition the cards on any teardown that
   * is not an unmount.
   */
  destroy() {
    this.running = false
    this.held = null
    this.history = []
    cancelAnimationFrame(this.raf)
    this.detach()
  }
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v
}
