import Lottie from "react-lottie-player";
import preloader from "../assets/preloader-lottie.json";
export default function PendingComponent() {
  return (
    <div className="h-full w-full flex items-center justify-center text-center">
      <div>
        <Lottie
          loop
          animationData={preloader}
          play
          style={{ width: 80, height: 80 }}
        />
      </div>
    </div>
  );
}
