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

  test "should get editPoints" do
    get guilds_editPoints_url
    assert_response :success
  end

  test "should get editMembers" do
    get guilds_editMembers_url
    assert_response :success
  end

  test "should get editatWar" do
    get guilds_editatWar_url
    assert_response :success
  end

  test "should get editWarLog" do
    get guilds_editWarLog_url
    assert_response :success
  end

end
