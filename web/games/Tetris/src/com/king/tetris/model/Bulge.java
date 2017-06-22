package com.king.tetris.model;

import android.graphics.PointF;

import com.king.tetris.Direction;

/**
 * 凸形   
 *      ▊
 *    ▊  ▊ ▊
 * @author: 004928
 * @date: 2016-9-8
 */
public class Bulge extends Shape {

	public Bulge(PointF startPoint , int width, Direction direction) {
		super(startPoint, width, direction);
	}
	
	@Override
	public void initShapePath(Direction direction) {
		getPonits().clear();
		switch (direction) {
		case LEFT:
			getPonits().add(getStartPoint());
			getPonits().add(new PointF(getStartPoint().x + 1, getStartPoint().y));
			getPonits().add(new PointF(getStartPoint().x + 1, getStartPoint().y - 1));
			getPonits().add(new PointF(getStartPoint().x + 1, getStartPoint().y + 1));
			setCenterPoint(new PointF(getStartPoint().x + 1, getStartPoint().y));
			break;
		case UP:
			getPonits().add(getStartPoint());
			getPonits().add(new PointF(getStartPoint().x + 1, getStartPoint().y));
			getPonits().add(new PointF(getStartPoint().x + 1, getStartPoint().y - 1));
			getPonits().add(new PointF(getStartPoint().x + 2, getStartPoint().y));
			setCenterPoint(new PointF(getStartPoint().x + 1, getStartPoint().y));
			break;
		case RIGHT:
			getPonits().add(getStartPoint());
			getPonits().add(new PointF(getStartPoint().x , getStartPoint().y + 1));
			getPonits().add(new PointF(getStartPoint().x + 1, getStartPoint().y + 1));
			getPonits().add(new PointF(getStartPoint().x , getStartPoint().y + 2));
			setCenterPoint(new PointF(getStartPoint().x , getStartPoint().y + 1));
			break;
		case DOWN:
			getPonits().add(getStartPoint());
			getPonits().add(new PointF(getStartPoint().x + 1, getStartPoint().y));
			getPonits().add(new PointF(getStartPoint().x + 1, getStartPoint().y + 1));
			getPonits().add(new PointF(getStartPoint().x + 2, getStartPoint().y ));
			setCenterPoint(new PointF(getStartPoint().x + 1 , getStartPoint().y));
			break;
		}
	}
	
}
