/* eslint-disable react/prop-types */
const SidebarListItem = ({ miniSidebar, title, icon }) => {
  return (
    <p className="w-full flex items-center gap-2 px-5 py-4 hover:bg-[#255f6f]/5 text-xs font-semibold lg:text-sm bg-white hover:text-[#255f6f] duration-150 cursor-pointer">{icon}<span className={`${!miniSidebar ? "text-[0px] pr-0":"text-inherit  pr-20"} duration-300`} title={title}>{title}</span></p>
  )
}

export default SidebarListItem