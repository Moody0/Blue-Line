import { IosSpinner } from "@/components/ui/ios-spinner";

export default function ShopLoading() {
  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-white">
      <IosSpinner size="lg" />
    </div>
  );
}
