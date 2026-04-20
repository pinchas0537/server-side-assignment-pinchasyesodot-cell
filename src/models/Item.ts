import { model, Schema } from "mongoose";
import { ISItem } from "../interfaces/Item";

const ItemSchema = new Schema<ISItem>(
    {
        name: { type: String, required: true, unique: true, index: true },
        consumerPrice: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0 },
        category: { type: String, required: true },
        supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    },
    { timestamps: true }
);

ItemSchema.post("save", async function () {
    try {
        const SupplierModel = model("Supplier");
        const originalPrice = (this.consumerPrice / 1.3).toFixed(2);
        await SupplierModel.findByIdAndUpdate(this.supplierId, {
            $push: {
                items: {
                    itemName: this.name,
                    price: originalPrice,
                },
            },
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(`Failed to update supplier with new item: ${errorMessage}`);
        throw error;
    }
});

export const Item = model<ISItem>("Item", ItemSchema);