require "parallel"

module Mapping
  class MParallel
    def initialize(enumerable)
      @enumerable = enumerable
    end

    def each(&block)
      Parallel.each(enumerable, &block)
    end

    def map(&block)
      Parallel.map(enumerable, &block)
    end

    private

    attr_accessor :enumerable
  end
end
