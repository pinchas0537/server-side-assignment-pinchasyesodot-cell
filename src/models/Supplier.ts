import { Schema, UpdateQuery, model } from "mongoose";
import { ISupplier } from "../interfaces/Supplier";
import { Item } from "./Item";

const SupplierSchema = new Schema<ISupplier>(
    {
        name: { type: String, required: true, unique: true, index: true },
        items: [
            {
                itemName: { type: String, required: true },
                price: { type: Number, required: true, min: 0 },
            },
        ],
    },
    { timestamps: true }
);

SupplierSchema.pre<ISupplier>("save", async function () {
    try {
        if (this.isModified("items") || this.isNew) {
            const ItemModel = this.model("Item");

            const itemPromises = this.items.map((item) => {
                return ItemModel.findOneAndUpdate(
                    { name: item.itemName, supplierId: this._id },
                    {
                        $set: {
                            consumerPrice: item.price * 1.3,
                        },
                        $setOnInsert: {
                            stock: 0,
                            category: "כללי",
                        },
                    },
                    { upsert: true, new: true }
                ).exec();
            });
            await Promise.all(itemPromises);
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(`Failed to update items for supplier: ${errorMessage}`);
        throw error;
    }
});

SupplierSchema.pre("findOneAndDelete", async function () {
    try {
        const query = this.getQuery();
        const supplierId = query._id;
        await Item.deleteMany({ supplierId: supplierId }).exec();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(`Failed to delete items for supplier: ${errorMessage}`);
        throw error;
    }
});

SupplierSchema.pre("findOneAndUpdate", async function () {
    const update = this.getUpdate() as UpdateQuery<ISupplier>;
    const items = update.$set?.items || update.items;
    if (!Array.isArray(items)) return;
    try {
        const supplierId = this.getQuery()._id;
        const ItemModel = model("Item");
        const operations = items.map((item) => ({
            updateOne: {
                filter: { name: item.itemName, supplierId: supplierId },
                update: {
                    $set: {
                        consumerPrice: item.price * 1.3,
                    },
                    $setOnInsert: {
                        stock: 0,
                        category: "כללי",
                    },
                },
                upsert: true,
            },
        }));
        await ItemModel.bulkWrite(operations);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(`Failed to update items for supplier: ${errorMessage}`);
        throw error;
    }
});

export const Supplier = model<ISupplier>("Supplier", SupplierSchema);
