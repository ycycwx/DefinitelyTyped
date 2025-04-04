import { AllowPartial, Data, Full, Helpers, PartialHelpers } from "meteor/dburles:collection-helpers";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

// Cursor<T> and Collection<T> are pulled from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/meteor/mongo.d.ts
// and should be kept in sync with any changes to it
// only modified properties are included

declare module "meteor/mongo" {
    namespace Mongo {
        interface Collection<T> {
            /**
             * Provide the definitions here for the methods and Helper<T>s you declared on your item interface.
             * Use helpers<AllowPartial> if you want to provide the helpers across multiple calls.
             * Tip: If you make those properties non-optional, they still won't be required when inserting items,
             * but you'll know that any object of your interface type has them.
             * Alternatively, if they're marked optional on your interface, they'll still be guaranteed on any
             * object you get out of the collection.
             * If you plan to pass around and create a lot of items pre-insertion, make them optional and use Full<T>
             * for ones with helpers attached.
             * If you plan to mostly pass around items that came out of a collection, make them required and use Data<T>
             * when creating new items.
             */
            // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
            helpers<allowPartial extends (false | AllowPartial) = false>(
                helpers: allowPartial extends AllowPartial ? PartialHelpers<T> : Helpers<T>,
            ): void;

            // modifications:
            // - replaced T with Full<T> & T everywhere Collection._transform is applied
            // - replaced T with Data<T> everywhere the user provides a T

            allow(options: {
                insert?: ((userId: string, doc: Full<T> & T) => boolean) | undefined;
                update?:
                    | ((userId: string, doc: Full<T> & T, fieldNames: string[], modifier: any) => boolean)
                    | undefined;
                remove?: ((userId: string, doc: Full<T> & T) => boolean) | undefined;
                fetch?: string[] | undefined;
                // ditto
                // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                transform?: Function | null | undefined;
            }): boolean;
            deny(options: {
                insert?: ((userId: string, doc: Full<T> & T) => boolean) | undefined;
                update?:
                    | ((userId: string, doc: Full<T> & T, fieldNames: string[], modifier: any) => boolean)
                    | undefined;
                remove?: ((userId: string, doc: Full<T> & T) => boolean) | undefined;
                fetch?: string[] | undefined;
                // ditto
                // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                transform?: Function | null | undefined;
            }): boolean;
            findOne(
                selector?: Selector<T> | ObjectID | string,
                options?: {
                    sort?: SortSpecifier | undefined;
                    skip?: number | undefined;
                    fields?: FieldSpecifier | undefined;
                    reactive?: boolean | undefined;
                    // ditto
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                    transform?: Function | null | undefined;
                },
            ): (Full<T> & T) | undefined;
            // ditto
            // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
            insert(doc: OptionalId<Data<T>>, callback?: Function): string;
            update(
                selector: Selector<T> | ObjectID | string,
                modifier: Modifier<Data<T>>,
                options?: {
                    multi?: boolean | undefined;
                    upsert?: boolean | undefined;
                    arrayFilters?: Array<{ [identifier: string]: any }> | undefined;
                },
                // ditto
                // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                callback?: Function,
            ): number;
            upsert(
                selector: Selector<T> | ObjectID | string,
                modifier: Modifier<Data<T>>,
                options?: {
                    multi?: boolean | undefined;
                },
                // ditto
                // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                callback?: Function,
            ): {
                numberAffected?: number | undefined;
                insertedId?: string | undefined;
            };
        }

        // modifications: replaced T with Full<T> & T everywhere Collection._transform is applied
        // note: it's not applied for observeChanges; however, ObserveChangesCallbacks uses Partial<T> anyway
        interface Cursor<T> {
            fetch(): Array<Full<T> & T>;
            forEach(callback: (doc: Full<T> & T, index: number, cursor: Cursor<T>) => void, thisArg?: any): void;
            map<U>(callback: (doc: Full<T> & T, index: number, cursor: Cursor<T>) => U, thisArg?: any): U[];
            observe(callbacks: ObserveCallbacks<Full<T> & T>): Meteor.LiveQueryHandle;
        }
    }
}
