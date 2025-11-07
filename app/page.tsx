import LoginForm from "@/components/auth/login-form";
import { ShoppingBasket } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <ShoppingBasket className="size-4" />
            </div>
            Gang Nikmat Inventory
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        {/* <img
          src="https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/ff5afa02-fcdb-48a3-88f1-3c48bc2cac70_restaurant-image_1661310150280.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
        <Image
          src="https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/ff5afa02-fcdb-48a3-88f1-3c48bc2cac70_restaurant-image_1661310150280.jpg"
          alt="Image"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
