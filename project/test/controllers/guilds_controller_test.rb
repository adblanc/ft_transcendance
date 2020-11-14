require 'test_helper'

class GuildsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get guilds_index_url
    assert_response :success
  end

  test "should get show" do
    get guilds_show_url
    assert_response :success
  end

  test "should get new" do
    get guilds_new_url
    assert_response :success
  end

  test "should get edit" do
    get guilds_edit_url
    assert_response :success
  end

end
