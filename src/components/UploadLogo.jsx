export default function UploadLogo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <input type="file" className="text-sm" />
      <p className="text-xs text-gray-500 text-center">
        JPG / PNG até 2MB
      </p>
    </div>
  );
}
