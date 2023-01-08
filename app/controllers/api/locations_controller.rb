class Api::LocationsController < ApplicationController
  def index
    @locations = Location.all

    @locations = @locations.map do |location|
      set_location_details(location)
    end
    
  end 

  def show
    @location = Location.find(params[:id])
    
    @location = set_location_details(@location)
    
  end

  


  private
  def location_params
    params.require(:location).permit(:location_name, :description)
  end

  def set_location_details(location)
    location.lesson_types = []
    location.lessons.each do |lesson|
      location.lesson_types.push(lesson.lesson_type)
    end
    location.lesson_types.uniq!

    location_ratings_arr = location.reviews.map do |review|
      review.rating
    end
    location.average_rating = location_ratings_arr.sum / location_ratings_arr.length if location_ratings_arr.length > 0
    location.review_count = location.reviews.length
    return location
  end

end