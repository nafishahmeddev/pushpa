import Spinner from "./baseui/Spinner";

export default function PendingComponent() {
  return (
    <div className="h-full w-full flex items-center justify-center text-center">
      <div>
        <Spinner />
      </div>
    </div>
  );
}
