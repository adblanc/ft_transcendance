class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    stream_from "appearance_channel"
    current_user.appear("online")
  end

  def unsubscribed
    current_user.disappear
  end

  def appear(data)
    current_user.appear(data["appearing_on"])
  end

end
