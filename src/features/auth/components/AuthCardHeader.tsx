import Image from "next/image";

const AuthCardHeader = ({header, description}: {header: string, description: string}) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={"/auth/jooav-logo-illus.svg"}
        alt="JOOAV Logo"
        width={38}
        height={41}
        className="py-xl"
      />
      <div className="flex flex-col items-center text-center gap-6 font-garantpro">
        <h3 className="text-heading">{header}</h3>
        <p className="text-base text-card-foreground font-medium lg:w-[400px]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AuthCardHeader;
