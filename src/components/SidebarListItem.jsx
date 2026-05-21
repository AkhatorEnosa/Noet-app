/* eslint-disable react/prop-types */
const SidebarListItem = ({ miniSidebar, title, icon }) => {
  return (
    <p className="w-full flex items-center gap-2 px-5 py-4 hover:bg-[#255f6f]/5 dark:hover:bg-[#3b8a9e]/10 text-xs font-semibold lg:text-sm bg-white dark:bg-dark-surface hover:text-[#255f6f] dark:hover:text-[#3b8a9e] duration-150 cursor-pointer dark:text-dark-text">{icon}<span className={`${!miniSidebar ? "text-[0px] pr-0":"text-inherit  pr-20"} duration-300`} title={title}>{title}</span></p>
  )
}

export default SidebarListItem