import type { Project } from '@/content/projects'

type Props = {
  project: Project
  index: number
  total: number
}

export function ProjectCard({ project, index, total }: Props) {
  return (
    <a
      className="card"
      data-card
      data-orientation={project.orientation}
      href={project.href}
      style={{ '--accent': project.accent } as React.CSSProperties}
    >
      <div className="card__top">
        <p className="card__index">
          {String(index + 1).padStart(2, '0')}
          <span className="visually-hidden"> of {total}</span>
          <span aria-hidden="true"> / {String(total).padStart(2, '0')}</span>
        </p>
        <p className="card__kicker">{project.kicker}</p>
        <h3 className="card__title">{project.title}</h3>
        <p className="card__outcome">{project.outcome}</p>
      </div>

      {/* Reserved slot. Add `image` to the project entry and it fills the
          card's open space — no layout change needed. */}
      {project.image && (
        <figure className="card__media">
          <img src={project.image.src} alt={project.image.alt} loading="lazy" />
        </figure>
      )}

      <div className="card__bottom">
        <div className="card__foot">
          <span className="card__role">{project.role}</span>
          <span>{project.timeframe}</span>
          <span className="card__cta" aria-hidden="true">
            Read study →
          </span>
        </div>
      </div>
    </a>
  )
}
