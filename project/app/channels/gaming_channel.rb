class GamingChannel < ApplicationCable::Channel
  def subscribed
     stream_from "gaming_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
