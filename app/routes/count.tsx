import { FormEvent, startTransition, useOptimistic } from "react";
import { RouteDurableObject, useDurableObject, useFetcher } from "@orange-js/orange";
import { state } from "diffable-objects";

export class CounterDurableObject extends RouteDurableObject<Env> {
  #state = state(this.ctx, "state", { count: 0 });

  static id = "counter";

  async loader() {
    return this.#state;
  }

  async action() {
    this.#state.count++;
    return this.#state;
  }
}

export default function Counter() {
  const { Form, submit } = useFetcher();
  const { count } = useDurableObject<CounterDurableObject>();
  const [optimisticCount, optimisticIncrement] = useOptimistic(
    count,
    (c) => c + 1
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      optimisticIncrement(null);
      await submit(e.currentTarget);
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Form className="flex flex-col items-center gap-4 w-20 p4" onSubmit={(e) => onSubmit(e)} method="patch">
        <h2 className="text-xl">Count</h2>
        <h1 className="text-3xl">{optimisticCount}</h1>
        <button
          className="min-w-4 bg-orange-500 hover:bg-orange-600 transition-colors ease-in-out text-black p-2 rounded"
          type="submit"
        >
          INCREMENT
        </button>
      </Form>
    </div>
  );
}
