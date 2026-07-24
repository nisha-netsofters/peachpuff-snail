// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/HorizontalLayout";

// ** Menu Items Array
import horizontalNavigation from "@src/navigation/horizontal";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const HorizontalLayout = (props) => {
  const { user } = useSelector((state) => state.user);
  const [navigation, setNavigation] = useState([]);
  const slug = localStorage.getItem("slug");
  useEffect(() => {
    const temp = [];
    horizontalNavigation?.filter((ele) => {
      ele?.permission?.filter((element) => {
        if (element == user?.role?.name) {

          ele.navLink.startsWith("/superadmin/")
            ? temp.push({ ...ele })
            : temp.push({ ...ele, navLink: `/${slug}` + ele.navLink });
        }
      });
    });
    setNavigation(temp);
  }, []);

  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  return (
    <Layout menuData={navigation} {...props}>
      {props.children}
    </Layout>
  );
};

export default HorizontalLayout;
