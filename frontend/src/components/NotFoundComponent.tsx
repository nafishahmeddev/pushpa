import Button from "@app/components/baseui/Button";
import { useNavigate } from "@tanstack/react-router";
export default function NotFoundComponent() {
  const navigate = useNavigate();
  return (
    <div className="h-dvh w-dvw bg-indigo-50 flex items-center justify-center">
      <div className="text-center flex flex-col gap-3 items-center">
        <h1 className="text-indigo-700 text-6xl font-mono font-bold">404</h1>
        <p>The page you are looking for is not found!</p>
        <Button
          className="bg-indigo-600 text-white w-[130px]"
          onClick={() => navigate({ to: "/" })}
        >
          go to home
        </Button>
      </div>
    </div>
  );
}
