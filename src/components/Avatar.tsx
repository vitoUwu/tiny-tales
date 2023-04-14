import Image, { type StaticImageData } from "next/image";

type AvatarProps = {
  source: string | StaticImageData;
  size: number;
};

export function Avatar({ source, size }: AvatarProps) {
  return (
    <Image
      className="aspect-square h-fit rounded-full"
      height={size}
      width={size}
      src={source}
      alt="Ícone de usuário"
    />
  );
}
