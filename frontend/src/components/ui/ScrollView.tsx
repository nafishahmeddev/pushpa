import { CustomScroll } from "react-custom-scroll";
export default function ScrollView({ ...props }) {
  return (
    <CustomScroll
      {...props}
      heightRelativeToParent="100%"
      handleClass="!bg-black/30 !w-1.5"
    />
  );
}
