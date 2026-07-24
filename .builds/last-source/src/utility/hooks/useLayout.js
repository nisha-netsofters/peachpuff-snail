//** React Imports
// import { useEffect, useCallback } from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { handleLayout, handleLastLayout } from '@store/layout'

export const useLayout = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const state = useSelector((state) => state);
  // console.log(state);
  const role = state?.auth?.user?.role?.name;

  const store = state?.layout;

  const setLayout = (value) => {
    dispatch(handleLayout(value));
  };

  const setLastLayout = (value) => {
    dispatch(handleLastLayout(value));
  };

  // const handleLayoutUpdate = useCallback(() => {
  //   // ** If layout is horizontal & screen size is equals to or below 1200
  //   if (store.layout === 'horizontal' && window.innerWidth <= 1200) {
  //     setLayout('vertical')
  //     setLastLayout('horizontal')
  //   }
  //   // ** If lastLayout is horizontal & screen size is equals to or above 1200
  //   if (store.lastLayout === 'horizontal' && window.innerWidth >= 1200) {
  //     setLayout('horizontal')
  //   }
  // }, [])

  // // ** ComponentDidMount
  // useEffect(() => {
  //   handleLayoutUpdate()
  // }, [])

  // useEffect(() => {
  //   // ** Window Resize Event
  //   window.addEventListener('resize', handleLayoutUpdate)
  // }, [store.layout, store.lastLayout])

  if (window) {
    let breakpoint;
    if (role == "Client") {
      breakpoint = 1160;
    } else {
       breakpoint = 1560;
    }

    if (window.innerWidth <= breakpoint) {
      setLayout("vertical");
    }
    if (
      window.innerWidth > breakpoint &&
      store.lastLayout !== store.layout
    ) {
      setLayout(store.lastLayout);
    }

    window.addEventListener("resize", () => {
      if (
        window.innerWidth <= breakpoint &&
        store.lastLayout !== "vertical" &&
        store.layout !== "vertical"
      ) {
        setLayout("vertical");
      }
      if (
        window.innerWidth >= breakpoint &&
        store.lastLayout !== store.layout
      ) {
        setLayout(store.lastLayout);
      }
    });
  }

  return { layout: store.layout, setLayout, lastLayout: store.lastLayout, setLastLayout }
}
