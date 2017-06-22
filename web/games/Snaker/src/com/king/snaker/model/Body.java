package com.king.snaker.model;

import android.graphics.Rect;
/**
 * 物体基类
 * @author: 004928
 * @date: 2016-9-8
 */
public class Body {
	
	/**当前物体在地图数组的中的位置下标*/
	private int x ;
	private int y ;
	/**当前物体被绘制在地图上的位置*/
	private Rect rect ;
	// 1表示蛇 0 表示食物
	private int flag ;
	
	public Body(Rect rect, int flag) {
		super();
		this.rect = rect;
		this.flag = flag;
	}

	public Rect getRect() {
		return rect;
	}
	
	public void setRect(Rect rect) {
		this.rect = rect;
	}
	
	public int getFlag() {
		return flag;
	}
	
	public void setFlag(int flag) {
		this.flag = flag;
	}

	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}
	
}
