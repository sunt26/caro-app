import { MenuItemProps } from "../types"

export const MenuItem = (props: MenuItemProps) => {
  const { icon, text, number, handler, subtext, highlight } = props
  return (
    <div className="menu-link" onClick={handler}>
      <div className={`menu-item ${highlight ? 'highlight' : ''}`}>
        <div className="menu-content">
          <div className="menu-icon-container">
            {icon}
          </div>
          <div className="menu-text-container">
            <span className="menu-text">{text}</span>
            <span className="menu-subtext">{subtext}</span>
          </div>
        </div>
        <div className={`menu-number ${highlight ? 'highlight' : ''}`}>
          <span>{number}</span>
        </div>
      </div>
    </div>
  )
}
