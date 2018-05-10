import Cable from "actioncable";

interface Meta extends Element {
  content: string;
}

interface CableAction {
  type: "FOO";
}

export const init = (store: any) => {
  const meta = document.head.querySelector("[name=action-cable-url]") as Meta;
  const url = meta ? meta.content : "";

  const cable = Cable.createConsumer(url);
  cable.subscriptions.create(
    {
      channel: "FeedsChannel",
    },
    {
      connected: () => {},
      received: (action: CableAction) => {
        switch (action.type) {
          case "FOO": {
            store.dispatch({ type: "FOO" });
          }
        }
      },
      disconnected: () => {},
    }
  );
};
