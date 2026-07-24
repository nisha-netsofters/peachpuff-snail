// ** Menu Components Imports
import HorizontalNavMenuLink from './HorizontalNavMenuLink'
import HorizontalNavMenuGroup from './HorizontalNavMenuGroup'
import {
  // canViewMenuGroup,
  // canViewMenuItem
  resolveHorizontalNavMenuItemComponent as resolveNavItemComponent
} from '@layouts/utils'
// import { useSelector } from 'react-redux'

const HorizontalNavMenuItems = props => {

  // const user = useSelector(state => state.auth.user)
  // ** Components Object
  const Components = {
    HorizontalNavMenuGroup,
    HorizontalNavMenuLink
  }

  // ** Render Nav Items
  const RenderNavItems = props.items.map((item, index) => {
    const TagName = Components[resolveNavItemComponent(item)]
    // if (user?.email != 'gunjan@growworkinfotech.com') { 
    //   if (item?.id == "Saved-Candidates") {
    //     return null
    //   }
    //   return <TagName key={item.id || item.header} item={item} {...props} />
    // }
    if (item.children) {
      return <TagName item={item} index={index} key={item.id} {...props} />
    }
    return <TagName item={item} index={index} key={item.id} {...props} />
  })

  return RenderNavItems
}

export default HorizontalNavMenuItems
