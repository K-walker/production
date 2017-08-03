package com.king.tetris.model;

import java.util.ArrayList;
import java.util.List;

import android.graphics.PointF;

import com.king.tetris.Direction;
/**
 * 图形基类
 * @author: 004928
 * @date: 2016-9-9
 */
public abstract class Shape {

	/*起始点*/
	private PointF startPoint ;
	private PointF centerPoint ;
	/**起始方向*/
	private Direction direction ;
	/**每个方块的宽度*/
	private int itemWidth ; 
	private List<PointF> ponits ;
	public Shape(PointF startPoint , int width , Direction direction) {
		this.startPoint = startPoint ;
		this.direction = direction;
		this.itemWidth = width ;
		ponits = new ArrayList<PointF>();
		initShapePath(getDirection());
	}
	
	/**
	 * 初始化图形，根据给定的方向
	 * @param direction
	 */
	public abstract void initShapePath(Direction direction);
	
	public List<PointF> getPonits() {
		return ponits;
	}

	public void setPonits(List<PointF> ponits) {
		this.ponits = ponits;
	}

	public PointF getStartPoint() {
		return startPoint;
	}

	public void setStartPoint(PointF startPoint) {
		this.startPoint = startPoint;
	}
	
	public Direction getDirection() {
		return direction;
	}
	
	/**
	 * 变换方向，顺时针旋转90度
	 * @param direction
	 */
	public void setDirection(Direction direction) {
		this.direction = direction;
		for (PointF point : getPonits()) {
			float newX = getCenterPoint().x - point.y + getCenterPoint().y ;
			float newY = point.x - getCenterPoint().x + getCenterPoint().y ;
			point.x = newX ;
			point.y = newY ;
		}
	}

	public int getItemWidth() {
		return itemWidth;
	}

	public void setItemWidth(int itemWidth) {
		this.itemWidth = itemWidth;
	}

	public PointF getCenterPoint() {
		return centerPoint;
	}

	public void setCenterPoint(PointF centerPoint) {
		this.centerPoint = centerPoint;
	}
}
