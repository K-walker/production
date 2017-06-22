package com.king.tetris.model;

import android.graphics.PointF;

import com.king.tetris.Direction;
/**
 * 阶梯形 
 *      ▉▉
 *       ▉▉
 * 
 * @author: 004928
 * @date: 2016-9-9
 */
public class Ladder extends Shape {

	public Ladder(PointF startPoint, int width, Direction direction) {
		super(startPoint, width, direction);
	}

	@Override
	public void initShapePath(Direction direction) {
		getPonits().clear();
		switch (direction) {
		case LEFT:
		case RIGHT:
			getPonits().add(getStartPoint());
			getPonits().add(new PointF(getStartPoint().x + 1, getStartPoint().y ));
			getPonits().add(new PointF(getStartPoint().x + 1, getStartPoint().y + 1));
			getPonits().add(new PointF(getStartPoint().x + 2, getStartPoint().y + 1));
			setCenterPoint(new PointF(getStartPoint().x + 3 / 2, getStartPoint().y + 1));
			break;
		case UP:
		case DOWN:
			getPonits().add(getStartPoint());
			getPonits().add(new PointF(getStartPoint().x , getStartPoint().y + 1));
			getPonits().add(new PointF(getStartPoint().x + 1, getStartPoint().y ));
			getPonits().add(new PointF(getStartPoint().x +  1, getStartPoint().y - 1));
			setCenterPoint(new PointF(getStartPoint().x + 1, getStartPoint().y + 1 / 2));
			break;
		}
	}

}
