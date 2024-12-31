import Button from "@app/components/ui/form/button";
import { useNavigate } from "react-router";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="h-dvh w-dvw bg-fuchsia-50 flex items-center justify-center">
      <div className="text-center flex flex-col gap-3 items-center">
        <h1 className="text-fuchsia-700 text-6xl font-mono font-bold">404</h1>
        <p>The page you are looking for is not found!</p>
        <Button
          className="bg-fuchsia-600 text-white w-[130px]"
          onClick={() => navigate("/")}
        >
          go to home
        </Button>
      </div>
    </div>
  );
}
