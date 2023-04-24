import * as Dialog from "@radix-ui/react-dialog";
import { Trash, X } from "phosphor-react";
import { Button } from "../Button";

type EditButtonProps = {
  onConfirm: () => void;
};

export function DeleteButton({ onConfirm }: EditButtonProps) {
  return (
    <Dialog.Root modal>
      <Dialog.Trigger asChild>
        <Button fill type="primary">
          <Trash className="text-red-600" size={24} />
          <p>Delete</p>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal className="transition-all">
        <Dialog.Overlay className="fixed inset-0 bg-black/50 transition-all" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 space-y-3 rounded-md border border-zinc-700 bg-zinc-900 p-3 text-zinc-200 md:w-[250px]">
          <div className="flex justify-between">
            <Dialog.Description className="text-lg font-semibold">
              Are you sure you want to delete this post?
            </Dialog.Description>
            <Dialog.Close className="flex items-start">
              <X size={24} />
            </Dialog.Close>
          </div>
          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button type="primary">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button type="primary" onClick={onConfirm}>
                Confirm
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
