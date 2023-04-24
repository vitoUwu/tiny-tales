import * as Dialog from "@radix-ui/react-dialog";
import { Pencil, X } from "phosphor-react";
import { useRef } from "react";
import { Button } from "../Button";
import { Loading } from "../Loading";
import { PostContentInput } from "./ContentInput";

type EditButtonProps = {
  isEditingPost: boolean;
  content: string;
  onEdit: (content: string) => void;
};

export function EditButton({
  isEditingPost,
  content,
  onEdit,
}: EditButtonProps) {
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Dialog.Root modal>
      <Dialog.Trigger asChild>
        <Button fill type="primary" disabled={isEditingPost}>
          {isEditingPost ? (
            <Loading size={24} />
          ) : (
            <>
              <Pencil size={24} />
              <p>Edit</p>
            </>
          )}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal className="transition-all">
        <Dialog.Overlay className="fixed inset-0 bg-black/50 transition-all" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 space-y-3 rounded-md border border-zinc-700 bg-zinc-900 p-3 text-zinc-200 md:w-[50%]">
          <div className="flex justify-between">
            <Dialog.Title className="text-2xl font-semibold">
              Edit Post Content
            </Dialog.Title>
            <Dialog.Close>
              <X size={24} />
            </Dialog.Close>
          </div>
          <PostContentInput defaultValue={content} ref={textInputRef} />
          <div className="flex justify-end">
            <Dialog.Close asChild>
              <Button
                type="primary"
                onClick={() => {
                  onEdit(textInputRef.current!.value);
                }}
              >
                Save
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
