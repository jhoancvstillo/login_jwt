import { Loader } from "lucide-react";


export const FullPageLoader = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
            <Loader className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );
  };