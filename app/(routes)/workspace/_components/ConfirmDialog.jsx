'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDialog({ open, onClose, onConfirm }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Design</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this design? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => onClose(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
