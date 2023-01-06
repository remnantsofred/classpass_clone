# == Schema Information
#
# Table name: lesson_dates
#
#  id         :bigint           not null, primary key
#  lesson_id  :bigint           not null
#  start_time :datetime         not null
#  end_time   :datetime         not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class LessonDate < ApplicationRecord
  validates :lesson_id, :start_time, :end_time, presence: true

  has_many :reservations,
    foreign_key: :lesson_date_id,
    class_name: :Reservation


end