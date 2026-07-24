// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
import verticalNavigation from "@src/navigation/vertical";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const VerticalLayout = (props) => {
  const { user } = useSelector((state) => state.user);
  const [navigation, setNavigation] = useState([]);
  useEffect(() => {
    const temp = [];
    const slug = localStorage.getItem("slug");
    verticalNavigation?.filter((ele) => {
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

  return (
    <Layout menuData={navigation} {...props}>
      {props.children}
    </Layout>
  );
};

export default VerticalLayout;
