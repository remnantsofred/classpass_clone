class Api::LocationsController < ApplicationController
  def index
    @locations = Location.all

    @locations = @locations.map do |location|
      location.lesson_types = []
      location.lessons.each do |lesson|
        # if !location.lesson_types.include?(lesson.lesson_type)
          location.lesson_types.push(lesson.lesson_type)
        # end
      end
      location.lesson_types.uniq!
     
      location
    end
    
  end 

  def show
    @location = Location.find(params[:id])

    # render :show
  end

  


  private
  def location_params
    params.require(:location).permit(:location_name, :description)
  end

end