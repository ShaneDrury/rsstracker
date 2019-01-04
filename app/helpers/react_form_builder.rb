class ReactFormBuilder < ActionView::Helpers::FormBuilder
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::ActiveModelInstanceTag
  include ActionView::Context

  def multipart?; end

  def confirmation_button(extra_class: "", name: "")
    @template.tag.div(
      data: {
        delete_button: "",
        extra_class: extra_class,
        name: name
      },
    )
  end
end
