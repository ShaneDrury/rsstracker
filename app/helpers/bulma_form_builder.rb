class BulmaFormBuilder < ActionView::Helpers::FormBuilder
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::ActiveModelInstanceTag
  include ActionView::Context

  def multipart?; end

  def submit(options={})
    wrap_field(super(options.reverse_merge(class: "button is-primary")))
  end

  def text_field(attribute, options={})
    wrap_field(super(attribute, options.reverse_merge(class: "input")), attribute)
  end

  def text_area(attribute, options={})
    wrap_field(super(attribute, options.reverse_merge(class: "textarea")), attribute)
  end

  def check_box(attribute, options={})
    wrap_field(super(attribute, options.reverse_merge(class: "checkbox")), attribute)
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