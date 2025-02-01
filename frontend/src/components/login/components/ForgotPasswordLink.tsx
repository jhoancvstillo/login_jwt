import { CardFooter } from "@/components/ui/card";

const ForgotPasswordLink = () => {
  return (
    <CardFooter className="flex justify-center">
      <a href="#" className="text-sm text-muted-foreground hover:underline">
        ¿Olvidaste tu contraseña?
      </a>
    </CardFooter>
  );
};

export default ForgotPasswordLink;

