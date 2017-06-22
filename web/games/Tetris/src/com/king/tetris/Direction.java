package com.king.tetris;

public enum Direction {

	LEFT 
	{
		 @Override 
		 public Direction onRotate() {
			 return UP;
		}
	}, 
	UP  
	{
		@Override
		public Direction onRotate() {
			
			return RIGHT;
		}
	},
	RIGHT 
	{
		@Override
		public Direction onRotate() {
			
			return DOWN;
		}
	},
	DOWN
	{
		@Override
		public Direction onRotate() {
			return LEFT;
		}
	};
	
	public abstract Direction onRotate();
}
