class BulmaFormBuilder < ActionView::Helpers::FormBuilder
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::ActiveModelInstanceTag
  include ActionView::Context
  include ReactHelper

  def multipart?; end

  def submit(options={})
    wrap_field(super(options.reverse_merge(class: "button is-primary")))
  end

  def text_field(attribute, options={})
    wrap_field(super(attribute, options.reverse_merge(class: "input")), attribute)
  end

  def collection_select(attribute, collection, value_method, text_method, options = {}, html_options = {})
    wrap_field(super(attribute, collection, value_method, text_method, options, html_options.reverse_merge(class: "select")), attribute)
  end

  def text_area(attribute, options={})
    wrap_field(super(attribute, options.reverse_merge(class: "textarea")), attribute)
  end

  def check_box(attribute, options={})
    wrap_field(super(attribute, options.reverse_merge(class: "checkbox")), attribute)
  end

  def confirmation_button(name: "", extra_class: nil)
    react_confirmation_button(
      extra_class: ["button", "is-danger", extra_class].compact.join(" "),
      name: name
    )
  end

  def wrap_field(f, attribute=nil)
    @template.tag.div class: "field is-horizontal" do
      (@template.tag.div class: "field-label is-normal" do
        unless attribute.nil?
          @template.label(object_name, attribute, class: "label")
        end
      end) +
        (@template.tag.div class: "field-body" do
          @template.tag.div class: "field" do
            f
          end
        end)
    end
  end
end
