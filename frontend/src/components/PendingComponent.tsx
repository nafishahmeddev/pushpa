export default function PendingComponent() {
  return (
    <div className="h-full w-full flex items-center justify-center text-center">
      <div>
        <img
          src="/preloader.gif"
          loading="lazy"
          style={{ width: 80, height: 80 }}
        />
      </div>
    </div>
  );
}
