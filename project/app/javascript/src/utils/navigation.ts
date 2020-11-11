import Backbone from "backbone";

export const catchNavigation = () => {
  $(document).on("click", "a", function (evt) {
    const href = { prop: $(this).prop("href"), attr: $(this).attr("href") };

    const root =
      location.protocol + "//" + location.host + Backbone.history.options.root;

    if (href.prop && href.prop.slice(0, root.length) === root) {
      if (
        Backbone.history.navigate(href.attr || "", {
          trigger: true,
        })
      ) {
        evt.preventDefault();
      }
    }
  });
};
