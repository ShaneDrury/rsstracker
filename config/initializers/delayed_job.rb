module Delayed
  class Job
    def mark_retriable!
      update!(
        locked_at: nil,
        locked_by: nil,
        attempts: 0,
        run_at: Time.now,
        last_error: "Retry requested",
        failed_at: nil
      )
    end
  end
end
