module ReactHelper
  def react_confirmation_button(extra_class: "", name: "")
    @template.tag.div(
      data: {
        delete_button: "",
        extra_class: extra_class,
        name: name
      },
    )
  end
end
