import { DeleteButtonProps } from "@/types";

function DeleteButton({
  title,
  style,
  cod_image,
  delete_image,
}: DeleteButtonProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        delete_image(cod_image);
      }}
    >
      <button className={style}>{title}</button>
    </form>
  );
}

export default DeleteButton;
