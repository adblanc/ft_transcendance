import { eventBus } from "src/events/EventBus";

export function listenVisibilityChanges() {
  let hidden,
    visibilityChange = "";

  if (typeof document.hidden !== "undefined") {
    (hidden = "hidden"), (visibilityChange = "visibilitychange");
  } else if (typeof document.msHidden !== "undefined") {
    (hidden = "msHidden"), (visibilityChange = "msvisibilitychange");
  }

  let document_hidden = document[hidden];

  document.addEventListener(visibilityChange, function () {
    if (document_hidden != document[hidden]) {
      document_hidden = document[hidden];
      eventBus.trigger("visibility:change", document_hidden);
    }
  });
}
