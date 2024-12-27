import { CustomScroll } from "react-custom-scroll";
export default function ScrollView({...props }) {
  return <CustomScroll {...props} className={`overflow-auto ${props.className}`} heightRelativeToParent="100%" handleClass="!bg-green-700/30 !w-1.5"/>
}