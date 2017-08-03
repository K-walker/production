package com.king.tetris.model;

import android.graphics.PointF;

import com.king.tetris.Direction;
/**
 * 正方形
 *    ▊▊
 *    ▊▊
 * @author: 004928
 * @date: 2016-9-9
 */
public class Square extends Shape {

	public Square(PointF startPoint, int width, Direction direction) {
		super(startPoint, width, direction);
	}

	@Override
	public void initShapePath(Direction direction) {
		getPonits().clear();
		switch (direction) {
		case LEFT:
		case UP:
		case RIGHT:
		case DOWN:
			getPonits().add(getStartPoint());
			getPonits().add(new PointF(getStartPoint().x + 1 , getStartPoint().y ));
			getPonits().add(new PointF(getStartPoint().x , getStartPoint().y + 1 ));
			getPonits().add(new PointF(getStartPoint().x + 1 , getStartPoint().y + 1));
			setCenterPoint(new PointF(getStartPoint().x + 1, getStartPoint().y + 1));
			break;
		}
	}

}
