// ** Vertical Menu Components
import VerticalNavMenuLink from './VerticalNavMenuLink'
import VerticalNavMenuGroup from './VerticalNavMenuGroup'
import VerticalNavMenuSectionHeader from './VerticalNavMenuSectionHeader'

// ** Utils
import {
  // canViewMenuItem,
  // canViewMenuGroup,
  resolveVerticalNavMenuItemComponent as resolveNavItemComponent
} from '@layouts/utils'
// import { useSelector } from 'react-redux'

const VerticalMenuNavItems = props => {

  // const user = useSelector(state => state.auth.user)
  // ** Components Object
  const Components = {
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
    VerticalNavMenuSectionHeader
  }

  // ** Render Nav Menu Items
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
    return <TagName key={item.id || item.header} item={item} {...props} />
  })

  return RenderNavItems
}

export default VerticalMenuNavItems
